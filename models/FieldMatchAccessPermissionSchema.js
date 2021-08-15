import mongoose from "mongoose";
const Schema = mongoose.Schema;

const typeError = 'Value does not match a selected type';

// Defines the permissions schema for field match access form's permissions.
const FieldMatchAccessPermissionSchema = new Schema({
  formFieldPath: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  operator: {
    type: String,
    enum: ['$eq', '$lt', '$gt', '$lte', '$gte', '$in'],
    default: '$eq'
  },
  valueType: {
    type: String,
    enum: ['string', 'number', 'boolean', '[string]', '[number]'],
    required: true,
    default: 'string',
    validate: [
      {
        validator: function(type) {
          switch (type) {
            case 'number':
              return isFinite(Number(this.value));
            case 'boolean':
              return (this.value === 'true' || this.value === 'false');
            case '[number]':
              return this.value.replace(/(^,)|(,$)/g, '')
                .split(',')
                .map(val => Number(val))
                .every(val => isFinite(val));
          }
        },
        message: typeError
      }
    ]
  },
  roles: {
    type: [Schema.Types.ObjectId],
    ref: 'role',
  }
}, {_id: false});

export default FieldMatchAccessPermissionSchema;
