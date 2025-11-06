// Exact types requested by the user — keep these unchanged
export type Role = 'Analyst' | 'Manager' | 'Auditor'
export type PhaseStatus = 'Not Started' | 'In Progress' | 'Testing Completed' | 'Addressing Comments' | 'Completed'
export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'
export type TestRequestStatus = 'Pending' | 'In Progress' | 'Complete'

export interface Control {
  id: string;                 // VGCP-xxxxx
  name: string;               // Procedure / Control name
  description?: string;
  owner: string;
  sme?: string;
  tester?: string;
  needsEscalation: boolean;
  dat: { status: PhaseStatus; step?: string; };
  oet: { status: PhaseStatus; step?: string; };
  testingNotes?: string;
  startDate?: string;         // ISO yyyy-mm-dd
  dueDate?: string;           // ISO
  eta?: string;               // ISO
  completedDate?: string;     // ISO
}

export interface TestRequest {
  id: string;                 // r{timestamp} if missing
  controlId: string;          // must match Control.id (VGCP-xxxxx)
  requestedBy: string;        // user id or name string
  scope: string;              // free text
  dueDate: string;            // ISO yyyy-mm-dd
  status: TestRequestStatus;  // default 'Pending'
}
