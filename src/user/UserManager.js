import moment from 'moment-timezone'
import { logger, usersCollection } from '../app/AppService.js'

export const createUser = (randomUser) => {
  const creatableUser = { ...randomUser, createdAt: moment().tz('Europe/Moscow').format('YYYY-MM-DD') }

  return usersCollection.insert(creatableUser).then(() => {
    return creatableUser
  }).catch(err => {
    logger.error(err)
  })
}
