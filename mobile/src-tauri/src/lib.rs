package

name = "vita-note"
version = "0.1.0"
description = "A Tauri App"
authors = ["you"]
license = ""
publish = false

[lib]
name = "vita_note"
crate-type = ["cdylib"]

[dependencies]
vita-note = { path = ".." }
