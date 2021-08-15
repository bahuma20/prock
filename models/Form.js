import _ from "lodash";
import mongoose from "mongoose";
import FieldMatchAccessPermissionSchema from "./FieldMatchAccessPermissionSchema.js";

const Schema = mongoose.Schema;

const objectId = (id) => {
  try {
    return _.isObject(id)
      ? id
      : mongoose.Types.ObjectId(id);
  } catch (e) {
    return id;
  }
};

const permissionSchema = new Schema({
  type: {
    type: String,
    enum: [
      'create_all',
      'read_all',
      'update_all',
      'delete_all',
      'create_own',
      'read_own',
      'update_own',
      'delete_own',
      'self'
    ],
    required: 'A permission type is required to associate an available permission with a given role.'
  },
  roles: {
    type: [Schema.Types.ObjectId],
    ref: 'role'
  }
}, {_id: false});

const formSchema = new Schema({
  title: {
    type: String,
    description: 'The title for the form.',
    required: true
  },
  name: {
    type: String,
    description: 'The machine name for this form.',
    required: true,
  },
  path: {
    type: String,
    description: 'The path for this resource.',
    index: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['form', 'resource'],
    required: true,
    default: 'form',
    description: 'The form type.',
    index: true
  },
  display: {
    type: String,
    description: 'The display method for this form'
  },
  action: {
    type: String,
    description: 'A custom action URL to submit the data to.'
  },
  tags: {
    type: [String],
    index: true
  },
  deleted: {
    type: Number,
    default: null
  },
  access: [permissionSchema],
  submissionAccess: [permissionSchema],
  fieldMatchAccess: {
    type: {
      read: [FieldMatchAccessPermissionSchema],
      write: [FieldMatchAccessPermissionSchema],
      create: [FieldMatchAccessPermissionSchema],
      admin: [FieldMatchAccessPermissionSchema],
      delete: [FieldMatchAccessPermissionSchema],
      update: [FieldMatchAccessPermissionSchema],
    },
  },
  owner: {
    type: Schema.Types.Mixed,
    ref: 'submission',
    index: true,
    default: null,
    set: owner => {
      // Attempt to convert to objectId.
      return objectId(owner);
    },
    get: owner => {
      return owner ? owner.toString() : owner;
    }
  },
  components: {
    type: [Schema.Types.Mixed],
    description: 'An array of components within the form.',
  },
  settings: {
    type: Schema.Types.Mixed,
    description: 'Custom form settings object.'
  },
  properties: {
    type: Schema.Types.Mixed,
    description: 'Custom form properties.'
  }
});

const Form = mongoose.model('Form', formSchema);

export default Form;
