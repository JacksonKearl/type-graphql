import { FieldMetadata } from "./field-metadata";
import { FederationObjectTypeMetadata } from "./federation-metadata";

export interface ClassMetadata {
  name: string;
  target: Function;
  fields?: FieldMetadata[];
  description?: string;
  isAbstract?: boolean;
  federation?: Partial<FederationObjectTypeMetadata>;
}
