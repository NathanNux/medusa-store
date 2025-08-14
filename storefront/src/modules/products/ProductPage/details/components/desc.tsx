type DescProps = {
    details: ({ title: string, content: string })[]

}

const Desc = ({ details }: DescProps) => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <ul className="w-full h-full flex items-center justify-between flex-row">
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
