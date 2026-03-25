
export interface EmailProcessingPayload {
  user_id:string;
  calendar_mail:string;
  calendar_refresh_token:string;
  calendar_provider:string; 
  subscription_date:Date;
  google_project_client_id:string;
  google_project_client_secret:string;
  microsoft_project_client_id:string;
  microsoft_project_client_secret:string;
  microsoft_project_object_id:string;
  subject_email:string;
  subject_provider:string;
  subject_password:string;
  subject_refresh_token:string;
  subject_imap_url:string;
  subject_imap_port:number;
  subject_smtp_url:string;
  subject_smtp_port:number;
}

export interface EmailSendQueuePayload {
  subject:string;
  to:string;
  content:string;
}
