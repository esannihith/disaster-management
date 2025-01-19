const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    location: {
        address: { 
            type: String, 
            required: true,
            trim: true 
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function(value) {
                    return (
                        value.length === 2 &&
                        typeof value[0] === "number" &&
                        value[0] >= -90 && value[0] <= 90 &&
                        typeof value[1] === "number" &&
                        value[1] >= -180 && value[1] <= 180
                    );
                },
                message: "Coordinates must be in the format [latitude, longitude] and valid."
            }
        },
        type: { 
            type: String, 
            default: "Point" 
        }
    },
facilities: {
    type: [String],
    required: true,
    enum: ["ICU", "Operation Theatre", "Emergency Room", "Radiology", "Maternity Ward"], // Core options
    validate: [arrayLimit, 'A hospital must have at least one facility'],
},
    capacity: { 
        type: Number, 
        required: true,
        min: [1, 'Capacity must be at least 1'] 
    },
    emergencyBeds: { 
        type: Number, 
        default: 0, 
        min: [0, 'Emergency beds cannot be negative'] 
    },
    contact: {
        phone: { 
            type: String,
            validate: {
                validator: function(v) {
                    return /\d{10}/.test(v); 
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        email: { 
            type: String,
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'] 
        }
    },
    photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" }],
    coordinator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },
    availabilityStatus: { 
        type: String, 
        enum: ["Open", "Full", "Closed"], 
        default: "Open" 
    },
    services: {
        type: [String],
        default: [], 
    },
    affiliatedDisasters: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Disaster" }
    ],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
  },
  { timestamps: true } 
);

function arrayLimit(val) {
    return val.length > 0;
}

module.exports = mongoose.model("Hospital", hospitalSchema);