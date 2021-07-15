import BaseError from "../../types/BaseError";

enum StringSchemaErrorEnum {
  None = "None",
  Type = "String/Type",
  Length = "String/Length",
  Case = "String/Case",
  Format = "String/Format",
  Enum = "String/InvalidValue",
}

type StringSchemaError = BaseError<StringSchemaErrorEnum>;

export { StringSchemaError, StringSchemaErrorEnum };
