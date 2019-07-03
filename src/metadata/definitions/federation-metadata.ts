interface Field {
  target: Function;
  name: string;
}

interface FieldWithFieldSet extends Field {
  fields: string;
}

export type FederationExternalMetadata = Field;
export type FederationRequiresMetadata = FieldWithFieldSet;
export type FederationProvidesMetadata = FieldWithFieldSet;

export interface FederationKeyMetadata {
  target: Function;
  fields: string;
}

export interface FederationExtendsMetadata {
  target: Function;
}

export interface FederationFieldTypeMetadata {
  external: FederationExternalMetadata;
  requires: FederationRequiresMetadata;
  provides: FederationProvidesMetadata;
}

export interface FederationObjectTypeMetadata {
  extends: FederationExtendsMetadata;
  key: FederationKeyMetadata;
}

export interface FederationMetadata {
  useApolloFederation: boolean;
  extends: FederationExtendsMetadata[];
  key: FederationKeyMetadata[];
  external: FederationExternalMetadata[];
  requires: FederationRequiresMetadata[];
  provides: FederationProvidesMetadata[];
}
