import Role from '../models/Role'
import User from '../models/User'
import { PERMISSIONS } from '~~/shared/permissions'
// import Seller from '../models/Seller'
// import WRStatus from '../models/WRStatus'

export const createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount()
        if (count > 0) return

        const values = await Promise.all([
            new Role({ name: 'user' }).save(),
            new Role({ name: 'moderator' }).save(),
            new Role({ name: 'nutritionist' }).save(),
            new Role({ name: 'admin' }).save()
        ])
        console.log(values);
    } catch (error) {
        console.error(error)
    }
}

export const createUsers = async () => {
    try {
        const count = await User.estimatedDocumentCount()
        // if (count > 0) return

        const values = await Promise.all([
            new User({
              name: 'Admin Principal',
              username: 'admin2',
              email: 'admin2@gmail.com',
              // @ts-expect-error
              password: await User.encryptPassword('123123'),
              roles: ['admin'],
              permissions: Object.values(PERMISSIONS)
            }).save()
        ])
        console.log(values);
    } catch (error) {
        console.error(error)
    }
}
// export const createSellers = async () => {
//     try {
//         const count = await Seller.estimatedDocumentCount()
//         if (count > 0) return

//         const values = await Promise.all([
//             new Seller({
//               name: 'CEO COMPRAS Y ENVIOS',
//               seller_code: 'CEOC',
//               email: 'info@comprasyenviosonline.com',
//               phone: ['7869706581'],
//               address: '7168 nw 50 st',
//               fee: '0.1'
//             }).save(),
//             new Seller({
//               name: 'ARLEX VELAZQUEZ',
//               seller_code: 'ARLX',
//               email: 'arlexv@hotmail.com',
//               phone: ['2870339', '3187162881'],
//               address: 'CRA 13A #38-89 APTO 206 EDIF. CATALINA III ',
//               fee: '0.3'
//             }).save()
//         ])
//         console.log(values);
//     } catch (error) {
//         console.error(error)
//     }
// }

// export const createWRStatuses = async () => {
//     try {
//         const count = await WRStatus.estimatedDocumentCount()
//         if (count > 0) return

//         const values = await Promise.all([
//             new WRStatus({ name: 'created' }).save(),
//             new WRStatus({ name: 'opened' }).save(),
//             new WRStatus({ name: 'finalized' }).save()
//         ])
//         console.log(values);
//     } catch (error) {
//         console.error(error)
//     }
// }
