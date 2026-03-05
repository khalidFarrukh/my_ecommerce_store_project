

export default function YesNoModal({ text1, cancelFunction, yesFunction }) {
  return (
    <div className="fixed inset-0 top-0 left-0 z-100 size-full flex items-center justify-center">
      <div
        onClick={cancelFunction}
        className="fixed size-full backdrop-blur-md bg-background_2/20 pointer-events-auto z-0 cursor-pointer"
        aria-hidden
      />
      <div className="z-1 bg-background_1 rounded-xl p-6 w-[90%] max-w-100 flex flex-col gap-5 border border-myBorderColor">

        <h2 className="text-lg font-semibold text-center">{text1}</h2>

        <div className="flex justify-end gap-3">
          <button
            onClick={cancelFunction}
            className="px-4 py-2 button1 rounded-md cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={yesFunction}
            className="px-4 py-2 button1 rounded-md cursor-pointer"
          >
            Yes
          </button>
        </div>

      </div>
    </div>
  )
}