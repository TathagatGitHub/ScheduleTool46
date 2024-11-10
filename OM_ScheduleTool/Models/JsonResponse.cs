namespace OM_ScheduleTool.Models
{
    
    public class JsonResponse
    {
        public Value Value { get; set; }
    }

    public class Value
    {
        public bool success { get; set; }
        public string responseText { get; set; }
    }


}
