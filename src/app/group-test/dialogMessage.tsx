import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'

function DialogMessage({showInstructions, setShowInstructions}:Readonly<{showInstructions: boolean, setShowInstructions: (showInstructions: boolean)=>void}>) {
    return (
        <Dialog open={showInstructions}>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Test Instructions</DialogTitle>
                    <DialogDescription>
                        Please read the following instructions carefully before starting the test:
                        <ul className="list-disc list-inside mt-2">
                            <li>Some questions may have multiple correct answers.</li>
                            <li>There can be coding questions as well.</li>
                            <li>You can review and change your answers before submitting.</li>
                        </ul>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setShowInstructions(false)}>Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DialogMessage