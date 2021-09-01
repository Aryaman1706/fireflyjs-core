import { firestore as __firestore } from "firebase-admin";
import Document from "../../Document";
import { ObjectSchema, KeyValueStore } from "../../SchemaTypes";
import { Errors } from ".";
import { ConfigPOJO } from "../MultipleQuery";
import { QueryConfigPOJO } from "../MultipleQuery/types/ConfigPOJO";
import buildQuery from "../MultipleQuery/utils/buildQuery";
import makeError from "../../utils/makeError";

class DeleteQuery<T extends KeyValueStore> {
  private __config: QueryConfigPOJO<T>;

  private __queryById: boolean = false;

  private __collectionRef: __firestore.CollectionReference;

  private __schema: ObjectSchema.Class<T>;

  constructor(
    input: QueryConfigPOJO<T>,
    collectionRef: __firestore.CollectionReference,
    schema: ObjectSchema.Class<T>,
    queryById: boolean = false
  ) {
    this.__config = input;
    this.__queryById = queryById;
    this.__collectionRef = collectionRef;
    this.__schema = schema;
  }

  public exec = async () => {
    if (!this.__config) {
      throw makeError(Errors.Invalid, "Delete Query not configured");
    }

    let query: __firestore.CollectionReference | __firestore.Query;
    let documentRef: any;

    if (
      this.__queryById &&
      this.__config._id &&
      typeof this.__config._id === "string"
    ) {
      documentRef = this.__collectionRef.doc(this.__config._id);
    } else {
      query = this.__collectionRef;

      Object.keys(this.__config).forEach((k: string) => {
        const key = k as keyof QueryConfigPOJO<T>;

        query = buildQuery<T>(key, this.__config[key] as ConfigPOJO<T>, query);
      });

      const querySnapshot = await query.get();

      documentRef = querySnapshot
        .docs[0] as __firestore.QueryDocumentSnapshot<__firestore.DocumentData>;
    }

    if (typeof documentRef === "undefined") {
      throw makeError(Errors.Undefined, "Document reference is undefined");
    }

    const document = new Document<T>(
      this.__config._id
        ? documentRef
        : (documentRef.ref as __firestore.DocumentReference<T>),
      this.__schema
    );

    await document.delete();
  };
}

export default DeleteQuery;
