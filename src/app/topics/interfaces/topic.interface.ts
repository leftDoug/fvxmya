export interface Topic {
  id: number;
  name: string;
  month?: Date;
  monthNumber?: number;
}

export interface TopicResponse {
  data?: Topic | Topic[];
  message?: string;
}
