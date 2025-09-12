
interface Package {
  trkgNum: string | null;
  measures: {
    l: number | null;
    w: number | null;
    h: number | null;
  },
  weight?: number | null;
  notes?: string | null;
}

export interface WR {
  _id?: number;
  wrId?: number;
  client?: string;
  packages?: Package[]
}