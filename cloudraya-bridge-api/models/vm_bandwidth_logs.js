export default function (sequelize, DataTypes) {
    return sequelize.define(
        "vm_bandwidth_logs",
        {
            log_id: {
                autoIncrement: true,
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            local_id: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                defaultValue: 6380,
                primaryKey: true,
                references: {
                    model: "vm_list",
                    key: "local_id",
                },
            },
            timestamp: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            sent_usage: {
                type: DataTypes.REAL,
                allowNull: true,
            },
            received_usage: {
                type: DataTypes.REAL,
                allowNull: true,
            },
            bandwidth_usage: {
                type: DataTypes.REAL,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "vm_bandwidth_logs",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "vm_bandwidth_logs_pkey",
                    unique: true,
                    fields: [{ name: "log_id" }, { name: "local_id" }],
                },
            ],
        },
    );
}
