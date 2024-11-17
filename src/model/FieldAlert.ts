export interface FieldAlertDTO {
  fieldId: string;
  labels: string[];
}

export interface FieldAlert {
  fieldId: string;
  fieldName: string;
  inDays: number;
  alertType: string;
}
