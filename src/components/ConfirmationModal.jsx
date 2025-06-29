function ConfirmationModal ({id, title, description, onConfirm, btnType, btnText}) {
    return(
        <div id={id} className="overlay modal overlay-open:opacity-100 hidden overlay-open:duration-300 modal-middle" role="dialog" tabIndex="-1">
            <div className="modal-dialog overlay-open:opacity-100 overlay-open:duration-300">
                <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button type="button" className="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close" data-overlay={`#${id}`} >
                        <span className="icon-[tabler--x] size-4"></span>
                    </button>
                </div>
                <div className="modal-body">
                    {description}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-soft btn-secondary" data-overlay={`#${id}`}>Close</button>
                    <button type="button" className={`btn ${btnType}`} onClick={onConfirm}>{btnText}</button>
                </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal;