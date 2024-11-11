import { Component, OnInit, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { Auth, deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut, updateProfile, User } from '@angular/fire/auth';
import { deleteObject, getDownloadURL, listAll, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { ActionSheetController, AlertButton, LoadingController, NavController } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { first } from 'rxjs';
import { isNullOrEmpty } from 'src/app/core/utils/is-null';
import { ChangeNameComponent } from '../../components/change-name/change-name.component';
import ConfirmPasswordComponent from '../../components/confirm-password/confirm-password.component';
import UserService from 'src/app/core/services/user.service';

@Component({
  selector: 'app-perfil-page',
  templateUrl: './perfil-page.component.html',
  styleUrls: ['./perfil-page.component.scss'],
  providers: [DialogService, MessageService]
})
export class PerfilPageComponent {

  user = signal<User | null>(this.auth.currentUser);

  
  async onSignOut() {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      header: 'Deseja prosseguir?',
      buttons: [
        {
          text: 'Sim',
          role: 'yes',
        },
        {
          text: 'Não',
          role: 'no'
        },
      ]
    });

    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();

    if (role === 'no') return;

    await signOut(this.auth);
    this.navController.navigateRoot('/account/login');
  }


  async onConfirmUserDelation() {
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      header: 'Deseja prosseguir?',
      buttons: [
        {
          text: 'Sim',
          role: 'yes',
        },
        {
          text: 'Não',
          role: 'no'
        },
      ]
    });

    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();

    if (role === 'no') return;

    const dialog = this.dialogService.open(ConfirmPasswordComponent, {
      header: 'Confirmar',
      modal: true,
      width: '90vw',
      position: 'center',
    });

    dialog.onClose.pipe(first())
      .subscribe(async password => {
        if (isNullOrEmpty(password)) return;
        
        try {
          const credential = EmailAuthProvider.credential(this.user()?.email!, password);
          await reauthenticateWithCredential(this.user()!, credential);
          await this.deleteUserFiles(this.user()?.uid!);

          this.messageService.add({
            severity: 'success',
            detail: 'Conta excluída',
          });

          setTimeout(async () => {
            await deleteUser(this.user()!);    
            this.userService.deleteUser().subscribe();
          }, 1000);

        } catch (error) {
          if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
            this.messageService.add({
              severity: 'error',
              detail: 'Credenciais inválidas',
            });
          }
        }
      }); 
  
  }
  
  constructor(
    readonly dialogService: DialogService,
    readonly messageService: MessageService,
    readonly userService: UserService,
    readonly auth: Auth,
    readonly router: Router,
    readonly storage: Storage,
    readonly loadingController: LoadingController,
    readonly actionSheetController: ActionSheetController,
    readonly navController: NavController,
  ) {}

  public showDialog() {
    const ref = this.dialogService.open(ChangeNameComponent, {
      header: 'Editar',
      modal: true,
      width: '90vw',
      styleClass: 'bg-red-500',
      position: 'center',
      data: {
        displayName: this.user()?.displayName,
      }
    });

    ref.onClose.subscribe(async newName => {
      const displayName = this.user()?.displayName ?? '';
      if (!isNullOrEmpty(newName) && newName.trim() !== displayName.trim()) {
        await updateProfile(this.user()!, {
          displayName: newName,
        });

        this.messageService.add({
          severity: 'success',
          summary: 'Atualização', detail: 'Nome atualizado',
          styleClass: 'left-0'
        });
      } 
    });
  }

  async onUpload(event: Event) {
    try {
      const target = event.target as HTMLInputElement;
      if (target.files === null || !target.files.length) return;
      const file = target.files[0];
      const userId = this.user()?.uid;
      if (!userId) return;
      const filePath = `profile_pictures/${userId}/${file.name}`; 
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      await updateProfile(this.user() as User, { photoURL: downloadUrl });
      this.messageService.add({
        severity: 'success',
        detail: 'Foto adicionada',
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        detail: 'Erro ao fazer o upload da foto',
      });
    }
  }

  async deleteUserPhoto() {
    try {
      const loading = this.loadingController.create({ 
        animated: true,
        spinner: 'bubbles',
        message: 'Carregando...',
      });
      (await loading).present();
      await this.deleteUserFiles(this.user()?.uid!);
      await updateProfile(this.user()!, { photoURL: '' });
      (await loading).dismiss();
    } catch (err) {
      console.log(err);
    }
  }

  async deleteUserFiles(userId: string) {
    try {
        const userFilesRef = ref(this.storage, `profile_pictures/${userId}`);
        const result = await listAll(userFilesRef);
        await Promise.all(result.items.map(async item => {
          console.log(item.name)
          const fileRef = ref(this.storage, `profile_pictures/${userId}/${item.name}`);
          await deleteObject(fileRef);
        }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
