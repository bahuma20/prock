import _ from "lodash";
import mongoose from "mongoose";

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

const accessSchema = new Schema({
  type: {
    type: String,
    enum: [
      'read',
      'create',
      'update',
      'delete',
      'write',
      'admin'
    ],
    required: 'A permission type is required to associate an available permission with a Resource.'
  },
  resources: {
    type: [Schema.Types.Mixed],
    ref: 'form',
    set(resources) {
      // Attempt to convert to objectId.
      return resources.map(objectId);
    },
    get(resources) {
      return Array.isArray(resources)
        ? resources.map((resource) => resource.toString())
        : resources;
    }
  }
}, {_id: false});

const TimestampPlugin = (schema) => {
  const created = {
    type: Date,
    index: true,
    description: 'The date this resource was created.',
    default: Date.now,
    __readonly: true,
  };

  // Add the created and modified params.
  schema.add({
    created,
    modified: {
      type: Date,
      index: true,
      description: 'The date this resource was modified.',
      __readonly: true,
    },
  });

  // On pre-save, we will update the modified date.
  schema.pre('save', function(next) {
    this.modified = new Date();
    next();
  });
};

// Defines what each external ID should be.
const ExternalIdSchema = new Schema({
  type: String,
  resource: String,
  id: String
});

// Add timestamps to the external ids.
ExternalIdSchema.plugin(TimestampPlugin);

const submissionSchema = new Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'form',
    index: true,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.Mixed,
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
  deleted: {
    type: Number,
    default: null
  },

  // The roles associated with this submission, if any.
  // Useful for complex custom resources.
  roles: {
    type: [mongoose.Schema.Types.Mixed],
    ref: 'role',
    index: true,
    set(roles) {
      // Attempt to convert to objectId.
      return roles.map(objectId);
    },
    get(roles) {
      return Array.isArray(roles)
        ? roles.map((role) => role.toString())
        : roles;
    }
  },


  access: {
    type: accessSchema,
    index: true,
  },

  // An array of external Id's.
  externalIds: [ExternalIdSchema],

  // Configurable meta data associated with a submission.
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    description: 'Configurable metadata.'
  },

  // The data associated with this submission.
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
