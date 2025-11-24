export enum ViolationType {
  NONE = "NONE",
  EXPIRED_PLATES = "EXPIRED_PLATES",
  BROKEN_LIGHT = "BROKEN_LIGHT",
  STOLEN_VEHICLE = "STOLEN_VEHICLE",
  WORN_TIRES = "WORN_TIRES",
  NO_INSURANCE = "NO_INSURANCE"
}

export interface GeneratedScenario {
  driverName: string;
  driverDialogue: string; // Funny excuse
  vehicleModel: string;
  vehicleColor: string;
  plateNumber: string;
  licenseExpiry: string; // ISO Date
  isStolen: boolean;
  brokenLight: boolean;
  wornTires: boolean;
  hasInsurance: boolean;
  actualViolation: ViolationType;
}

export interface GameState {
  score: number;
  quota: number; // Tickets needed
  ticketsIssued: number;
  shiftTime: string; // e.g., "08:30 AM"
  gameOver: boolean;
}

export enum InteractionMode {
  IDLE = "IDLE", // Watching cars
  STOPPED = "STOPPED", // Car pulled over
  SEARCHING = "SEARCHING", // Waiting for API
  TICKET_WRITING = "TICKET_WRITING",
  DIALOGUE = "DIALOGUE"
}