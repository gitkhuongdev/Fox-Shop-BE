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