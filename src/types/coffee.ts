export type Unit = 'cups' | 'ml' | 'oz' | 'fl_oz';

export interface CoffeeIntake {
  userId: string;
  timestamp: string;
  amount: number;
  unit: Unit;
}

export interface CoffeeEntry extends CoffeeIntake {
  id: string;
}

export type MeasurementSystem = 'metric' | 'imperial';

export const conversionRates = {
  cups_to_ml: 237,
  fl_oz_to_ml: 29.5735,
};