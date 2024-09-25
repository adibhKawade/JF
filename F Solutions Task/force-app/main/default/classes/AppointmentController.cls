public with sharing class AppointmentController {
    
    @AuraEnabled(cacheable=true)
    public static List<Appointment_Slot__c> getAvailableSlots() {
        return [SELECT Id, Appointment_Date__c,Start_Time__c, isActive__c FROM Appointment_Slot__c WHERE isActive__c = true];
    }
    
    @AuraEnabled
    public static void createAppointment(Map<String, Object> appointmentDetails) {
        try {
            String appointmentDateString = (String) appointmentDetails.get('appointmentDate');
            Date appointmentDate = Date.valueOf(appointmentDateString); // Convert String to Date
            
            /*String appointmentTimeString = (String) appointmentDetails.get('appointmentTime');
            Time appointmentTime = Time.newInstance(Integer.valueOf(appointmentTimeString.substring(0, 2)), 
                                                    Integer.valueOf(appointmentTimeString.substring(3, 5)), 
                                                    0, 0);*/
            
            Appointment_Detail__c newAppointment = new Appointment_Detail__c();
            newAppointment.Contact__c = (Id) appointmentDetails.get('contactId');
            newAppointment.Subject__c = (String) appointmentDetails.get('subject');
            newAppointment.Appointment_Date__c = appointmentDate;
            //newAppointment.Appointment_Time__c = appointmentTime;
            newAppointment.Description__c = (String) appointmentDetails.get('description');
            
            System.debug('Contact: ' + newAppointment.Contact__c);
            System.debug('Subject: ' + newAppointment.Subject__c);
            System.debug('Appointment Date: ' + newAppointment.Appointment_Date__c);
            //System.debug('Appointment Time: ' + newAppointment.Appointment_Time__c);
            System.debug('Description: ' + newAppointment.Description__c);
            
            insert newAppointment;
        } catch (Exception e) {
            System.debug('Error while creating appointment: ' + e.getMessage());
            throw new AuraHandledException('Failed to create appointment: ' + e.getMessage());
        }
    }
}