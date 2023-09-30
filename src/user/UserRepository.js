import _countBy from 'lodash/countBy.js'
import { logger, usersCollection } from '../app/AppService.js'

export const getUsers = (query = null) => {
  return usersCollection.find(query).then(res => {
    return res
  }).catch(err => {
    logger.error(err)
  })
}

export const getSortableFagots = (startDate, endDate) => {
  return usersCollection.find({
    createdAt: {
      $gte: startDate ?? '1990-01-01', $lte: endDate ?? '2099-12-31'
    }
  }).then(res => {
    let fagotsTop = _countBy(res, 'id')
    fagotsTop = Object.fromEntries(Object.entries(fagotsTop).sort((a, b) => a[1] >= b[1] ? -1 : 1))

    return fagotsTop
  }).catch(err => {
    logger.error(err)
  })
}
