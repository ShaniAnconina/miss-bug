import { bugService } from "../services/bug.service.js"

const { useState, useEffect } = React

export function BugFilter({ setFilterBy, onSort }) {

    const [filter, setFilter] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        setFilterBy(filter)
    }, [filter])

    function handleChange({ target }) {
        let { value, name: field } = target
        setFilter((prevFilter) => {
            return { ...prevFilter, [field]: value }
        })
    }



    return <section className="filter-container">

        <input type="text"
            id="title"
            name="title"
            className="title"
            placeholder="Search bugs"
            value={filter.title}
            onChange={handleChange} />

        <select id="minSeverity" name="minSeverity" className="minSeverity" value={filter.minSeverity} onChange={handleChange}>
            <option value="">Min severity</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>

        <select id="labels" name="label" className="labels" value={filter.label}  onChange={handleChange}>
            <option value="">By labels</option>
            <option value="critical">Critical</option>
            <option value="need-CR">Need CR</option>
            <option value="dev-branch">Dev branch</option>
        </select>

        <select className="sort" name="sort" id="sort" onChange={onSort}>
            <option value="">Sort by</option>
            <option value="createdAt">Created at</option>
            <option value="severity">Severity</option>
        </select>

    </section>
}