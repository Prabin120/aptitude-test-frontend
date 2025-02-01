// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useState } from "react";

// export default function TestRegistration({ showRegistration, setShowRegistration }: Readonly<{ showRegistration: boolean, setShowRegistration: (showInstructions: boolean) => void }>) {
//     const [payment, setPayment] = useState(false)
//     return (
//         <Dialog open={showRegistration}>
//             <DialogContent aria-describedby={undefined}>
//                 <DialogHeader>
//                     <DialogTitle>Test Registration</DialogTitle>
//                     <DialogDescription>
//                         Please pay the amount below to register for the test:
//                     </DialogDescription>
//                 </DialogHeader>
//                 <DialogFooter>
//                     <Button variant={"outline"} onClick={() => setShowRegistration(false)}> Cancel </Button>
//                     <Button onClick={() => setPayment(true)}> Place Order </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     )
// }