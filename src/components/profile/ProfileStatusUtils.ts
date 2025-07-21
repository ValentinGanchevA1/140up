export enum ProfileStatus {
  Active = 'Active',
  Pending = 'Pending',
  Suspended = 'Suspended',
  Closed = 'Closed',
}

export function getProfileStatusColor(status: ProfileStatus): string {
  switch (status) {
    case ProfileStatus.Active:
      return 'green';
    case ProfileStatus.Pending:
      return 'orange';
    case ProfileStatus.Suspended:
      return 'red';
    case ProfileStatus.Closed:
      return 'gray';
    default:
      return 'black';
  }
}

export function getProfileStatusText(status: ProfileStatus): string {
  switch (status) {
    case ProfileStatus.Active:
      return 'Active';
    case ProfileStatus.Pending:
      return 'Pending Approval';
    case ProfileStatus.Suspended:
      return 'Account Suspended';
    case ProfileStatus.Closed:
      return 'Account Closed';
    default:
      return 'Unknown Status';
  }
}
