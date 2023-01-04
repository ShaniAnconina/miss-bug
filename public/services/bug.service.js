const BASE_URL = '/api/bug/'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter
}

function query(filterBy = getDefaultFilter(), sortBy) {
    let queryParams = `?title=${filterBy.title}&minSeverity=${filterBy.minSeverity}&sortBy=${sortBy}&label=${filterBy.label}`
    return axios.get(BASE_URL + queryParams)
        .then(res => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    // bug.labels = bug.labels.split(',')
    const url = (bug._id) ? BASE_URL + `${bug._id}` : BASE_URL
    const method = (bug._id) ? 'put' : 'post'
    return axios[method](url, bug).then(res => res.data)
}

function getDefaultFilter() {
    return { title: '', minSeverity: '', label: '' }
}