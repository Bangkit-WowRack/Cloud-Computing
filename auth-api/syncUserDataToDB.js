import db from './models/index.js';
import Wreck from "@hapi/wreck";

const db_vm_list = db.vm_list;
export const syncVMUserData = async (server_user_detail_request, user_id) => {
    const { payload: vm_list_user } = await Wreck.get('https://api.cloudraya.com/v1/api/gateway/user/virtualmachines', server_user_detail_request);

    for (let i = 0; i < vm_list_user.data.servers.length; i++) {
        let { local_id, server_id, name, status, state, public_ip } = vm_list_user.data.servers[i];
        let { private_ip } = vm_list_user.data.servers[i].network_info;
        let { payload: vm_detail_user } = await Wreck.get(`https://api.cloudraya.com/v1/api/gateway/user/virtualmachines/${local_id}`, server_user_detail_request);
        let { memory, cpu, os } = vm_detail_user.data;
        await db_vm_list.upsert({ local_id, server_id, user_id, name, status, state, public_ip, private_ip, memory, cpu, os }, { fields: ['local_id'], returning: true });
        local_id = server_id = name = status = state = private_ip = private_ip = memory = cpu = os = null;
    }
};