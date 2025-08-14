type ShipmentProps = { 
    shipping: { title: string; content: string }[]
}


const Shipment = ({ shipping }: ShipmentProps) => {
    return (
        <div>
           {shipping.map((item, idx) => (
                <div key={idx}>
                    <h4>{item.title}</h4>
                <p>{item.content}</p>
            </div>
            ))}
        </div>
    )
}

export default Shipment 