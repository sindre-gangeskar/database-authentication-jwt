module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        Name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        EncryptedPassword: {
            type: Sequelize.BLOB,
            allowNull: false
        },
        Salt: {
            type: Sequelize.BLOB,
            allowNull: false
        }
    }, { timestamps: false })


    User.associate = function (models) {
        User.hasOne(models.Result);
    }

    return User;
}