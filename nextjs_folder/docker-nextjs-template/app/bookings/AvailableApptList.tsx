"use client";
type Props = {
    data: any;
}

export default function AvailableApptsList({ data }: Props) {
    
    return(
        <div>
            <h2> Available Appointments </h2>
            <pre> {JSON.stringify(data)}</pre>
        </div>
    )
}