
type AlertProps = {
    title: string,
    message: string,
}

export function Alert({ title, message}: AlertProps){

    return (
        <div className="p-4 mb-4 text-sm text-center text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800" role="alert">
        <span className="font-medium">{title}: </span> {message}
      </div>
    )

}