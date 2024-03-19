export interface ClinicInfoData {
  id: number;
  name: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  businessStartTime: string;
  businessEndTime: string;
  adminMemo: string;
  clinicSchedule: ClinicSchedule[];
}

interface ClinicSchedule {
  workDate: string;
  isClosed: boolean;
  memo: string;
}
