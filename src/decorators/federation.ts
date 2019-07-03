import { getMetadataStorage } from "../metadata/getMetadataStorage";
import { SymbolKeysNotSupportedError } from "../errors";
import { MethodAndPropDecorator } from "./types";

export interface FieldOptions {
  fields: string;
}

export function Extends(): ClassDecorator {
  return target => {
    getMetadataStorage().collectFederationExtendsMetadata({
      target,
    });
  };
}

export function Key({ fields }: FieldOptions): ClassDecorator {
  return target => {
    getMetadataStorage().collectFederationKeyMetadata({
      target,
      fields,
    });
  };
}

export function External(): MethodAndPropDecorator;
export function External(): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectFederationExternalMetadata({
      name: propertyKey,
      target: prototype.constructor,
    });
  };
}

export function Requires({ fields }: FieldOptions): MethodAndPropDecorator;
export function Requires({ fields }: FieldOptions): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectFederationRequiresMetadata({
      name: propertyKey,
      target: prototype.constructor,
      fields,
    });
  };
}

export function Provides({ fields }: FieldOptions): MethodAndPropDecorator;
export function Provides({ fields }: FieldOptions): MethodDecorator | PropertyDecorator {
  return (prototype, propertyKey, descriptor) => {
    if (typeof propertyKey === "symbol") {
      throw new SymbolKeysNotSupportedError();
    }

    getMetadataStorage().collectFederationProvidesMetadata({
      name: propertyKey,
      target: prototype.constructor,
      fields,
    });
  };
}
