import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = ({ onBlur, value }) => {
    const editorRef = useRef(null);
    const quillInstance = useRef(null);
    const [editorValue, setEditorValue] = useState(value || "");

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        ["link", "image"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ align: ["center", "right", "justify"] }],
                    ],
                },
            });

            // Set initial value for Quill
            if (value) {
                quillInstance.current.root.innerHTML = value;
            }

            // Handle content change
            quillInstance.current.on("text-change", () => {
                const data = quillInstance.current.root.innerHTML;
                setEditorValue(data);
                if (onBlur) {
                    onBlur(data);
                }
            });
        }

        // Cleanup on component unmount
        return () => {
            if (quillInstance.current) {
                quillInstance.current = null;
            }
        };
    }, []);

    useEffect(() => {
        // Update editor content if `value` changes
        if (
            quillInstance.current &&
            quillInstance.current.root.innerHTML !== value
        ) {
            quillInstance.current.root.innerHTML = value || "";
        }
    }, [value]);

    return <div ref={editorRef} style={{ height: "300px" }} />;
};

export default QuillEditor;
