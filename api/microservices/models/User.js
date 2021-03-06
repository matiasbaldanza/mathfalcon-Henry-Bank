const { DataTypes } = require("sequelize");
const crypto = require("crypto");

module.exports = (sequelize) => {
  sequelize.define(
    "user",
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "client"],
        defaultValue: "client",
        allowNull: false,
      },
      photo: {
        type: DataTypes.BLOB,
        get() { return this.getDataValue("photo").toString("utf8") },
      }, 
      documentPhoto: {
        type: DataTypes.BLOB,
        get() { return this.getDataValue("documentPhoto").toString("utf8") },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
          const rSalt = this.randomSalt();
          this.setDataValue("salt", rSalt);
          this.setDataValue(
            "password",
            crypto.createHmac("sha1", this.salt).update(value).digest("hex")
          );
        },
      },
      passcode: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          const rSalt = this.randomSalt();
          this.setDataValue("passcodeSalt", rSalt);
          this.setDataValue(
            "passcode",
            crypto.createHmac("sha1", this.passcodeSalt).update(value).digest("hex")
          );
        },
      },
      salt: {
        type: DataTypes.STRING,
      },
      passcodeSalt: {
        type: DataTypes.STRING,
      },
      docType: {
        type: DataTypes.ENUM,
        values: ["dni", "passport"],
      },
      docNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      streetNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      locality: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emailToken: {
        type: DataTypes.STRING,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      resetToken: {
        type: DataTypes.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
};
