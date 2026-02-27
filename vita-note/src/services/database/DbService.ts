// 移动端数据库服务 - 使用 Tauri Rust 后端
export {
  dbInit,
  userCreate,
  userGetByEmail,
  foodEntryCreate,
  foodEntryGetByUser,
  foodEntryDelete,
  bloodGlucoseCreate,
  bloodGlucoseGetByUser,
  bloodGlucoseDelete,
  medicationCreate,
  medicationGetByUser,
  medicationMarkTaken,
  medicationDelete,
  chatMessageCreate,
  chatMessageGetHistory
} from '../../api/tauri';
