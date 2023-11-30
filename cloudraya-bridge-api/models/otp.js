export default function (sequelize, DataTypes) {
    return sequelize.define(
        "otp",
        {
            otp_id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.SMALLINT,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            user_email: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            otp_code: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            generated_at: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            valid_until: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            auth_data_cache: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "otp",
            schema: "public",
            timestamps: false,
            indexes: [
                {
                    name: "otp_pkey",
                    unique: true,
                    fields: [{ name: "otp_id" }],
                },
            ],
        },
    );
}
