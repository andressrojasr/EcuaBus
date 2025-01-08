import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Frecuency } from 'src/app/models/frecuency.model';
import { Stop } from 'src/app/models/stop.model';
import { User } from 'src/app/models/user.model';
import { FirebaseSecondaryService } from 'src/app/services/firebase-secondary.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-frecuency',
  templateUrl: './create-frecuency.page.html',
  styleUrls: ['./create-frecuency.page.scss'],
})
export class CreateFrecuencyPage implements OnInit {

  
  utils = inject(UtilsService)
  firebase = inject(FirebaseService);
  secondaryFirebase = inject(FirebaseSecondaryService)
  frecuency: Frecuency
  stops: Stop[]=[]
  user = {} as User
  title: string;

  isModalOpen:boolean = false;
  control: FormControl;

  form= new FormGroup({
    id: new FormControl(''),
    origin: new FormControl('', [Validators.required, Validators.minLength(2)]),
    destiny: new FormControl('', [Validators.required, Validators.minLength(2)]),
    stops: new FormArray([]),
    price: new FormControl(0, [Validators.required]),
    document: new FormControl('', [Validators.required]),
    timeStart: new FormControl(null,[Validators.required]),
    timeEnd: new FormControl(null,[Validators.required]),
    time: new FormControl(0,[Validators.required]),
    isBlocked: new FormControl(false),
  })

  

  constructor() { }

  ngOnInit() {
    this.frecuency = history.state.frecuency
    this.user = this.utils.getFromLocalStorage('user');
    if (this.frecuency) {
      this.form.patchValue({
        id: this.frecuency.id,
        origin: this.frecuency.origin,
        destiny: this.frecuency.destiny,
        stops: this.frecuency.stops,
        price: this.frecuency.price,
        document: this.frecuency.document,
        time: this.frecuency.time,
        timeStart: this.frecuency.timeStart,
        timeEnd: this.frecuency.timeEnd,
        isBlocked: this.frecuency.isBlocked
      });
      if (this.frecuency.stops) {
        this.frecuency.stops.forEach((stop) => {
          this.addStop(stop.name, stop.price);
        });
      }
      this.title="Actualizar frecuencia"
    }else{
      this.title="Crear frecuencia"
    }
  }

  async takeImage()
  {
    const dataUrl = ( await this.utils.takePicture('Foto del conductor')).dataUrl
    this.form.controls.document.setValue(dataUrl)
  }

  async submit() {
    if (this.form.invalid) {
      this.utils.showToast({
        message: 'Por favor, completa todos los campos requeridos.',
        duration: 2500,
        color: 'danger',
        position: 'middle',
      });
      return;
    }
  
    if (this.frecuency) {
      this.updateFrecuency();
    } else {
      this.createFrecuency();
    }
  }

  async createFrecuency() {
    let path = `cooperatives/${this.user.uidCooperative}/frecuencies`

    const loading = await this.utils.loading();
    await loading.present();

    let dataUrl = this.form.value.document;
        let imagePath = `ecuabus/${this.user.uidCooperative}/frecuencies/${Date.now()}`;
        let imageUrl = await this.secondaryFirebase.uploadImage(imagePath, dataUrl);
        this.form.controls.document.setValue(imageUrl);

    delete this.form.value.id

    this.firebase.addDocument(path, this.form.value).then(async res => {
      
      this.utils.showToast({
        message: 'Frecuencia creada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })
      this.utils.routerLink('/home/admin/frecuencies')
    }).catch(error => {
      console.log(error);

      this.utils.showToast({
        message: error.message,
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      loading.dismiss();
    })
  }


    private async updateFrecuency() {
      let path = `cooperatives/${this.user.uidCooperative}/frecuencies/${this.frecuency.id}`;

      const loading = await this.utils.loading();
      await loading.present();

      try {
        if (this.form.value.document !== this.frecuency.document) {
          let dataUrl = this.form.value.document;
          let imagePath = `ecuabus/${this.user.uidCooperative}/frecuencies/${Date.now()}`;
          let imageUrl = await this.secondaryFirebase.uploadImage(imagePath, dataUrl);
          this.form.controls.document.setValue(imageUrl);
        }

        await this.firebase.updateDocument(path, this.form.value);

        this.utils.showToast({
          message: 'Frecuencia actualizada exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        let pathImage = await this.secondaryFirebase.getFilePath(this.frecuency.document)
        await this.secondaryFirebase.deleteFile(pathImage)
        this.utils.routerLink('/home/admin/frecuencies')
      } catch (error) {
        console.log(error);

        this.utils.showToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      } finally {
        loading.dismiss();
      }
    }

    addStop(name: string = '', price: number = 0) {
      const stopGroup = new FormGroup({
        name: new FormControl(name, [Validators.required]),
        price: new FormControl(price, [Validators.required, Validators.min(0)]),
      });
      this.stopsArray.push(stopGroup);
    }
  
    removeStop(index: number) {
      this.stopsArray.removeAt(index);
    }
  
    get stopsArray(): FormArray {
      return this.form.get('stops') as FormArray;
    }

    openPicker(formControl: FormControl) {
      this.isModalOpen = true;
      this.control = formControl
    }
    closePicker() {
      this.isModalOpen = false;
    }

    onPickerChange(event: any) {
      const isoString = event.detail.value; // El valor emitido por ion-datetime (ISO completo)
      if (isoString) {
        const date = new Date(isoString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = this.formatTime(hours, minutes); // Formato HH:mm
        this.control.setValue(formattedTime); // Actualiza el FormControl con el formato correcto
      }
      this.closePicker();
    }

    formatTime(hours: number, minutes: number): string {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
}
