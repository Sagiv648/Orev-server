

export const documentToObject = (doc) => {
    return Object.keys(doc.toObject()).filter(x => x != 'password' && x != '_id' && x != '__v' && x != 'privilege' )
    .reduce((o,key) => ({...o, [key] : doc.toObject()[key]}),{})
}