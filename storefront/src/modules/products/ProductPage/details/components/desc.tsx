type DescProps = {
    details: ({ title: string, content: string })[]

}

const Desc = ({ details }: DescProps) => {
    return (
        <div className="details__desc">
            <ul className="details__desc__list">
                { details.map((item, index) => (
                    <li key={index}>
                        <h4>{item.title}</h4>
                        <p>{item.content}</p>
                    </li>
                )) }
            </ul>
        </div>
    )
}

export default Desc;
