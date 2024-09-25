import { LightningElement, track, wire } from 'lwc';
import getAvailableSlots from '@salesforce/apex/AppointmentController.getAvailableSlots';
import createAppointment from '@salesforce/apex/AppointmentController.createAppointment';

export default class AppointmentForm extends LightningElement {
    @track appointmentDate;
    //@track appointmentTime;
    @track subject = '';
    @track description = '';
    @track appointmentDateOptions = [];
    //@track appointmentTimeOptions = [];
    @track errorMessage = '';
    @track successMessage = '';

    selectedContactId = '';

    @wire(getAvailableSlots)
    wiredSlots({ error, data }) {
        if (data) {
            this.processSlots(data);
        } else if (error) {
            this.errorMessage = 'Error fetching available slots.';
        }
    }

    /*convertTimeToServerFormat(timeString) {
        const [hours, minutes, seconds] = timeString.split(':');
        return `${hours}:${minutes}:${seconds}`;
    }*/

    processSlots(slots) {
        let dateOptions = [];
        //let timeOptions = [];
        slots.forEach(slot => {
            if (!dateOptions.some(option => option.label === slot.Appointment_Date__c)) {
                dateOptions.push({ label: slot.Appointment_Date__c, value: slot.Appointment_Date__c });
            }
            /*if (this.appointmentDate == slot.Appointment_Date__c) {
                timeOptions.push({ label: slot.Start_Time__c, value: slot.Start_Time__c });
            }*/
        });
        this.appointmentDateOptions = dateOptions;
        //this.appointmentTimeOptions = timeOptions;
    }

    handleAppointmentDateChange(event) {
        this.appointmentDate = event.detail.value;
    }

    /*handleAppointmentTimeChange(event) {
        this.appointmentTime = event.detail.value;
    }*/

    handleSubjectChange(event) {
        this.subject = event.target.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    handleContactChange(event) {
        this.selectedContactId = event.target.value;
    }

    handleSubmit() {
        if (this.isFormValid()) {
            const appointmentDetails = {
                appointmentDate: this.appointmentDate,
                //appointmentTime: this.convertTimeToServerFormat(this.appointmentTime),
                subject: this.subject,
                description: this.description,
                contactId: this.selectedContactId
            };
            
            createAppointment({ appointmentDetails })
                .then(result => {
                    this.successMessage = 'Appointment created successfully.';
                    this.errorMessage = '';
                    this.clearForm();
                })
                .catch(error => {
                    this.errorMessage = 'Failed to create appointment: ' + error.body.message;
                });
        }
    }

    isFormValid() {
        let isValid = true;
        this.errorMessage = '';

        if (!this.appointmentDate /*|| !this.appointmentTime*/ || !this.subject || !this.description || !this.selectedContactId) {
            this.errorMessage = 'All fields are required.';
            isValid = false;
        }

        return isValid;
    }

    clearForm() {
        this.appointmentDate = '';
        //this.appointmentTime = '';
        this.subject = '';
        this.description = '';
        this.selectedContactId = '';
    }
}
