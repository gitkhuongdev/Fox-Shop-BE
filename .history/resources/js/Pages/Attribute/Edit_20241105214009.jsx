import React from 'react'

function Edit() {
  return (
    <Layout>
    <>
        <Container>
            <div className="card border-0 shadow">
                <div className="card-header">
                    <h4 className="text-uppercase text-center">
                        Chỉnh sửa thuộc tính
                    </h4>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <label htmlFor="">
                                    Tiêu đề bài viết:
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="">
                                    Mô tả ngắn bài viết:
                                </label>
                                <textarea
                                    name="short"
                                    className="form-control"
                                    id=""
                                    value={short}
                                    onChange={(e) =>
                                        setShort(e.target.value)
                                    }
                                ></textarea>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="">
                                            Ngày bắt đầu:
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="start"
                                            value={start}
                                            onChange={(e) =>
                                                setStart(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="">
                                            Ngày kết thúc:
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            name="end"
                                            value={end}
                                            onChange={(e) =>
                                                setEnd(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="">
                                            Hình ảnh:
                                        </label>
                                        <button class="container-btn-file">
                                            Tải hình ảnh
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={changeImage}
                                                name="images"
                                                id=""
                                                className="mb-3"
                                            />
                                        </button>
                                        {showImg === true && (
                                            <div>
                                                <img
                                                    src={post.image}
                                                    alt="preview"
                                                    width="100"
                                                    height="100"
                                                    className="m-2"
                                                />
                                            </div>
                                        )}
                                        {image.length > 0 && (
                                            <div>
                                                <div className="d-flex">
                                                    {image.map(
                                                        (
                                                            img,
                                                            index
                                                        ) => (
                                                            <img
                                                                key={
                                                                    index
                                                                }
                                                                src={URL.createObjectURL(
                                                                    img
                                                                )}
                                                                alt={`preview-${index}`}
                                                                width="100"
                                                                height="100"
                                                                className="m-2"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group mt-3">
                        <label htmlFor="">Nội dung bài viết:</label>
                        <QuillEditor
                            value={content}
                            onBlur={setContent}
                        />
                    </div>
                </div>
                <div className="card-footer">
                    <div className="d-flex gap-3">
                        <div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleUpdatePost}
                            >
                                Lưu bài viết
                            </button>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleCancel}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    </>
</Layout>
  )
}

export default Edit