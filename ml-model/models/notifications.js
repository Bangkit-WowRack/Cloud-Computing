export default function (sequelize, DataTypes) {
    return sequelize.define(
        "notifications",
        {
            id_notification: {
                type: DataTypes.STRING(64),
                allowNull: false,
                primaryKey: true,
            },
            id_vm: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "vm_list",
                    key: "local_id",
                },
            },
            message: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "notifications",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "notifications_pkey",
                    unique: true,
                    fields: [{ name: "id_notification" }, { name: "id_vm" }],
                },
            ],
        }
    );
}
