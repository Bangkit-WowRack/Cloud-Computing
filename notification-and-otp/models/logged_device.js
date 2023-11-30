export default function (sequelize, DataTypes) {
    return sequelize.define(
        "logged_device",
        {
            device_id: {
                type: DataTypes.STRING(16),
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            expired_at: {
                type: DataTypes.SMALLINT,
                allowNull: false,
            },
            notif_receiver_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "logged_device",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "logged_device_pk",
                    unique: true,
                    fields: [{ name: "device_id" }],
                },
            ],
        },
    );
}
