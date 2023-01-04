

export function BugPreview({ bug }) {
    const seveIcon = '❗'
    return <article>
        <p className="severity">Severity<span>{bug.severity}</span></p>
        <h4>{bug.title}</h4>
        <h1>{seveIcon.repeat(bug.severity)}</h1>
        {bug.labels && <p>{bug.labels.join(' | ')}</p>}
    </article>
}