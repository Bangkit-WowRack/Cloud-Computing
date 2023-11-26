import db from '../models/index.js';
import Wreck from "@hapi/wreck";
import { addUserDataDB } from './controller.js';

const db_vm_list = db.vm_list;
export const syncVMUserData = async (server_user_detail_request, user_id) => {
    const { payload: vm_list_user } = await Wreck.get('https://api.cloudraya.com/v1/api/gateway/user/virtualmachines', server_user_detail_request);

    // Load API response data to database
    const vmDetailPromises = vm_list_user.data.servers.map(async (server) => {
        let { local_id, server_id, name, status, state, public_ip } = server;
        let { private_ip } = server.network_info;
        let { payload: vm_detail_user } = await Wreck.get(`https://api.cloudraya.com/v1/api/gateway/user/virtualmachines/${local_id}`, server_user_detail_request);
        let { memory, cpu, os } = vm_detail_user.data;
        await db_vm_list.upsert({ local_id, server_id, user_id, name, status, state, public_ip, private_ip, memory, cpu, os }, { fields: ['local_id'], returning: true });
    });
    await Promise.all(vmDetailPromises);

    // Delete all the VM data in the database if the data does not exist in API call
    const dataVMinDB = await db_vm_list.findAll({ where: { user_id: user_id } });
    const dataVMinAPI = vm_list_user.data.servers;
    const vmToDelete = dataVMinDB.filter(VMinDB => !dataVMinAPI.some(VMinAPI => VMinAPI.local_id === VMinDB.local_id));
    for (const vm of vmToDelete) {
        await db_vm_list.destroy({ where: { local_id: vm.local_id } });
    }
};

export const syncUserData = async (client_payload) => {
    const { payload: detail_user } = await Wreck.get('https://api.cloudraya.com/v1/api/gateway/user/detail', client_payload);
    const UserID = detail_user.data.id;
    await Promise.all([
        addUserDataDB(detail_user.data),
        syncVMUserData(client_payload, UserID)
    ]);
};