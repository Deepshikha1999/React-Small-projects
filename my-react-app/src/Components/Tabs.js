// export default function Tabs ({children,Button}){
//     return (
//         <>
//             <menu className="menu">
//                 {Button}
//             </menu>
//             {children}
//         </>
//     );
// }

export default function Tabs ({children,buttons,ButtonContainer='menu',...props}){
    return (
        <>
            <ButtonContainer className = {props.className}>
                {buttons}
            </ButtonContainer>
            {children}
        </>
    );
}